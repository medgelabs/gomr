package io.medgelabs.gomr

import cats.effect.{ExitCode, IO, IOApp}
import cats.effect.{ConcurrentEffect, ContextShift, Timer}
import cats.implicits._
import fs2.Stream
import org.http4s.client.blaze.BlazeClientBuilder
import org.http4s.implicits._
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware.Logger
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.io._
import scala.concurrent.ExecutionContext.global
import fs2.concurrent.Queue
import org.http4s.websocket.WebSocketFrame
import fs2.concurrent.Topic
import cats.effect.Sync
import cats.effect.Concurrent
import org.http4s.server.websocket.WebSocketBuilder

object GomrServer extends IOApp {

  // TODO typed messages. Not raw WebSocketFrame

  def run(args: List[String]) = {
    for {
      // Queue and Topic for Websocket orchestration
      q <- Queue.unbounded[IO, WebSocketFrame]
      t <- Topic[IO, WebSocketFrame](WebSocketFrame.Text("Init"))

      exitCode <- {
        val messageStream = q.dequeue.through(t.publish)
        val serverStream = stream[IO](q, t)
        val combined = Stream(messageStream, serverStream).parJoinUnbounded

        combined.compile.drain.as(ExitCode.Success)
      }
    } yield exitCode
  }

  def stream[F[_]: ConcurrentEffect](
      q: Queue[F, WebSocketFrame],
      t: Topic[F, WebSocketFrame]
  )(implicit T: Timer[F], C: ContextShift[F]): Stream[F, Nothing] = {
    for {
      client <- BlazeClientBuilder[F](global).stream

      httpApp = (
        GomrRoutes.roomRoutes[F] <+>
        GomrRoutes.ws[F](q,t)
      ).orNotFound

      // With Middlewares in place
      finalHttpApp = Logger.httpApp(true, true)(httpApp)

      exitCode <- BlazeServerBuilder[F]
        .bindHttp(8080, "0.0.0.0")
        .withHttpApp(finalHttpApp)
        .serve
    } yield exitCode
  }.drain
}

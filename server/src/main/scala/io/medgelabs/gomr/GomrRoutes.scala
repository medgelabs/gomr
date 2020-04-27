package io.medgelabs.gomr

import cats.effect.Sync
import cats.implicits._
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.io._
import cats.effect.IO
import cats.effect.Concurrent
import cats.effect.concurrent.Ref
import fs2.concurrent.{Queue, Topic}
import org.http4s.websocket.WebSocketFrame
import org.http4s.server.websocket.WebSocketBuilder

object GomrRoutes {

  def roomRoutes[F[_]: Sync]: HttpRoutes[F] = {
    val dsl = new Http4sDsl[F] {}
    import dsl._
    HttpRoutes.of[F] {
      // Get a Room's current board state
      case GET -> Root / "rooms" / roomId => NotImplemented()

      // Create a new Room
      case POST -> Root / "rooms" => NotImplemented()
    }
  }

  def ws[F[_]: Sync: Concurrent](
      q: Queue[F, WebSocketFrame],
      t: Topic[F, WebSocketFrame]
  ): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F] {}
    import dsl._

    val toClient = t.subscribe(1000)//.map(msg => SomeOtherType))

    HttpRoutes.of[F] {
      // Endpoint to promote to WS connection
      case GET -> Root / "ws" / roomId =>
        for {
          wsResp <- WebSocketBuilder[F].build(toClient, _.collect({
            case WebSocketFrame.Text(text, last) => WebSocketFrame.Text(s"Received $text", last)
          })
          .through(q.enqueue))
        } yield wsResp
    }
  }
}

APP_NAME=gomr
APP_PORT=3000
OUT_FOLDER=bin

.PHONY: mkOut
mkOut:
	mkdir -p ./${OUT_FOLDER}

.PHONY: linux
linux: mkOut
	GOOS=linux GOARCH=amd64 go build -o ${OUT_FOLDER}/${APP_NAME}-linux

.PHONY: linuxRun
linuxRun: linux
	./${OUT_FOLDER}/${APP_NAME}-linux -port ${APP_PORT}

.PHONY: mac
mac: mkOut
	GOOS=darwin GOARCH=amd64 go build -o ${OUT_FOLDER}/${APP_NAME}-mac

.PHONY: macRun
macRun: mac
	./${OUT_FOLDER}/${APP_NAME}-mac -port ${APP_PORT}

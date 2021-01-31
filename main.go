package main

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"klauskie.com/bird-rmc-server/controller"
	"net/http"
)

func main() {
	r := gin.Default()
	m := melody.New()

	r.LoadHTMLFiles("client.html")

	r.GET("/", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "client.html")
	})
	r.POST("/session", controller.NewSessionHandler)
	r.POST("/action/:sessionID", func(c *gin.Context) {
		controller.ClientMediaControlHandler(c, m)
	})
	r.GET("/ws/:sessionID", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		//m.Broadcast(msg)
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}

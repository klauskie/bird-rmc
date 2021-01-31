package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"io/ioutil"
	"math/rand"
	"net/http"
	"time"
)

type sessionMap map[string]*Session

var sessions sessionMap

type Session struct {
	sessionID, urlPath, website, ip string
}

type Command struct {
	ActionCode string `json:"action_code"`
	ActionLabel *string `json:"action_label"`
}

func init() {
	rand.Seed(time.Now().UnixNano())
	sessions = sessionMap{}
}

func NewSessionHandler(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
	}
	m := struct {
		Website string `json:"website"`
		IP string `json:"ip"`
	}{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		fmt.Println(err.Error())
	}

	sessionID := newSession(m.Website)
	c.JSON(http.StatusOK, gin.H{
		"sessionID": sessionID,
	})
}

func ClientMediaControlHandler(c *gin.Context, m *melody.Melody) {
	sID := c.Param("sessionID")
	s, err := fetchSession(sID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": err,
		})
		return
	}

	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
	}
	command := Command{}
	err = json.Unmarshal(body, &command)
	if err != nil {
		panic(err)
	}

	if m.IsClosed() {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "closed ws channel: " + sID,
		})
		return
	}
	err = m.BroadcastFilter([]byte(command.ActionCode), func(q *melody.Session) bool {
		return q.Request.URL.Path == s.urlPath
	})
}

func BrowserHandler(c *gin.Context) {

}

func wsSendCommand() {

}

func newSession(website string) string {
	sesID := randStringRunes(4)
	for {
		if _, ok := sessions[sesID]; !ok {
			break
		}
	}
	s := Session{
		sessionID: sesID,
		urlPath:   "/ws/" + sesID,
		website:   website,
		ip:        "",
	}
	sessions[sesID] = &s
	return sesID
}

func fetchSession(sID string) (*Session, error) {
	if s, ok := sessions[sID]; ok {
		return s, nil
	}
	return nil, errors.New("Invalid sessionID")
}

var letterRunes = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

func randStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

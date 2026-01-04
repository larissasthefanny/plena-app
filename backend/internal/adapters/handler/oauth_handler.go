package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/larissasthefanny/plena-app/backend/internal/core/ports"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type OAuthHandler struct {
	authService ports.AuthService
	googleOAuth *oauth2.Config
}

func NewOAuthHandler(authService ports.AuthService) *OAuthHandler {
	googleOAuth := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &OAuthHandler{
		authService: authService,
		googleOAuth: googleOAuth,
	}
}

func (h *OAuthHandler) HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := h.googleOAuth.AuthCodeURL("state", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *OAuthHandler) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "No code in URL", http.StatusBadRequest)
		return
	}

	token, err := h.googleOAuth.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	client := h.googleOAuth.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Error(w, "Failed to get user info: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var userInfo struct {
		Email      string `json:"email"`
		Name       string `json:"name"`
		Picture    string `json:"picture"`
		GivenName  string `json:"given_name"`
		FamilyName string `json:"family_name"`
	}

	if err := json.Unmarshal(data, &userInfo); err != nil {
		http.Error(w, "Failed to parse user info: "+err.Error(), http.StatusInternalServerError)
		return
	}

	jwtToken, err := h.authService.LoginOrRegisterWithGoogle(userInfo.Email, userInfo.Name)
	if err != nil {
		http.Error(w, "Failed to authenticate: "+err.Error(), http.StatusInternalServerError)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s", frontendURL, jwtToken)
	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

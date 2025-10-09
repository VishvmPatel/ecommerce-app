class GoogleAuthService {
  constructor() {
    this.isLoaded = false;
    this.clientId = '';
    this.loadGoogleScript();
  }

  loadGoogleScript() {
    if (window.google) {
      this.isLoaded = true;
      this.initializeGoogleAuth();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.isLoaded = true;
      this.initializeGoogleAuth();
    };
    document.head.appendChild(script);
  }

  initializeGoogleAuth() {
    if (!window.google || !this.isLoaded) return;

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });
  }

  handleCredentialResponse(response) {
    console.log('Google Sign-In Response:', response);
    
    this.verifyGoogleToken(response.credential);
  }

  async verifyGoogleToken(credential) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = '/';
      } else {
        console.error('Google Sign-In failed:', data.message);
        alert('Google Sign-In failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying Google token:', error);
      alert('An error occurred during Google Sign-In. Please try again.');
    }
  }

  renderButton(elementId, text = 'Continue with Google') {
    if (!this.isLoaded || !window.google) {
      const button = document.getElementById(elementId);
      if (button) {
        button.style.display = 'block';
        button.onclick = () => this.promptGoogleSignIn();
      }
      return;
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: '100%'
      }
    );
  }

  promptGoogleSignIn() {
    if (!this.isLoaded || !window.google) {
      alert('Google Sign-In is not available. Please try again later.');
      return;
    }

    window.google.accounts.id.prompt();
  }

  signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

const googleAuthService = new GoogleAuthService();

export default googleAuthService;

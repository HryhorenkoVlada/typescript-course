import { Router, Request, Response, NextFunction } from 'express'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not permitted')
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  if (req.session?.loggedIn) {
    res.send(`
    <div>
      <h1>Hi there</h1>
      <h3>You're logged in</h3>
      <a href="/logout">Logout</a>
    </div>
  `)
  } else {
    res.send(`
    <div>
      <h3>You're NOT logged in</h3>
      <a href="/login">Login</a>
    </div>
  `)
  }
})

router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button>Submit</button>
    </form>
  `)
})

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/')
})

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>It's a protected route</h1>
    </div>
  `)
})

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;
  if (email && password && email === 'test@test.com' && password === '123456') {
    req.session = { loggedIn: true }
    res.redirect('/')
  } else {
    res.send('Invalid email or password')
  }

})

export { router }
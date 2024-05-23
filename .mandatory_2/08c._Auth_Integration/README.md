## Next Auth Login Setup

### Setup Route.ts
Inside `/app/`, create: `/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth/next";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST }
```

### Setup Options.ts

Inside `[...nextauth]`, create `options.ts`, which exports the options used above.

```typescript
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: number;
            username: string;
            role: string;
            token: string;
            refreshToken: string;
        } & DefaultSession['user'];
    }
    interface User {
        id: number;
        username: string;
        role: string;
        token: string;
        refreshToken: string;
    }
}

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'jsmith' 
                },
                password: {
                    label: 'Password',
                    type: 'password' 
                }
            },
            async authorize(credentials, req) {
                try {
                    const res = await api.unprotectedApi.post<{
                        accessToken: string;
                    }>('/auth/login', JSON.stringify(payload), {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const token = res.data.accessToken;

                    interface Token {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid': string;
                        unique_name: string;
                        role: string;
                        nbf: number;
                        exp: number;
                        iat: number;
                    }
                    const decodedJwt = jwt_decode<Token>(token);

                    const user: User = {
                        id: parseInt(decodedJwt['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']),
                        username: decodedJwt.unique_name,
                        role: decodedJwt.role,
                        token: token,
                        refreshToken: token,
                    };

                    if (res.status === 200 && user) {
                        const session = { user };
                        session.user = user;
                        return user;
                    } else {
                        return null;
                    }
                } catch (err) {
                    console.error(err);
                    return null;
                }
            }
        })
    ]
};
```

### Middleware

Create a folder in `/src/`.

Example middleware which includes `admin/*` and `user/*`.

```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // `/admin` requires admin role
            if (req.nextUrl.pathname.includes("/admin")) {
                return token?.role === "admin";
            }
            // `/me` only requires the user to be logged in
            return !!token;
        }
    }
});

export const config = { matcher: ["/admin/:path*", "/profile/:path*"] }
```

### Setup session in app

Inside root layout, indicate that this page uses session.

```typescript
// Inside root layout component
import { useSession } from 'next-auth/react'

const Layout = ({ children }) => {
  const { data: session, status } = useSession()

  return (
    <>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}

export default Layout
```

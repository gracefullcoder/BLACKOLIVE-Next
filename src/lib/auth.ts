import connectToDatabase from "@/src/lib/ConnectDb";
import User from "@/src/models/user";
import GoogleProvider from "next-auth/providers/google";

const AuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: any) {
            connectToDatabase();
            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                const newUser = new User({ name: user.name, email: user.email, profileImage: user.image })
                await newUser.save();
            }

            return true;
        },
        async session({ session }: any) {
            connectToDatabase();
            const existingUser = await User.findOne({ email: session.user.email }).populate('cart.product')

            session.user = JSON.parse(JSON.stringify(existingUser));

            return session
        },
        async jwt({ token }: any) {
            connectToDatabase();
            const existingUser = await User.findOne({ email: token.email });

            token.isAdmin = true;
            return token
        }
    }
}

export default AuthConfig;
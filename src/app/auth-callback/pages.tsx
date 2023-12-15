import { useRouter, useSearchParams } from "next/navigation";

const pages = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    return (
        <div>
            <p>Auth Callback</p>
            <p>Origin: {origin}</p>
            <button onClick={() => router.push('/auth-callback?origin=dashboard')}>Login</button>
        </div>
    );
}

export default pages;

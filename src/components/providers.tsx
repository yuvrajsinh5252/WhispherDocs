"use client"

import { useState } from "react"
import { QueryClient } from "@tanstack/react-query"


const providers = () => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClent] = useState(() => {})
}

export default providers;
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: any
): Promise<void | NextResponse> {
  const endpoint = params.kindeAuth
  const handler = await handleAuth(request, endpoint)

  // Assuming handler is a function that takes request and response
  // and returns a Promise that resolves to void | Response
  return handler(request, { params })
}
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Auto-resize and optimize with sharp → WebP
    const optimized = await sharp(buffer)
      .resize(1200, 1600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Convert to base64 data URL (works everywhere, no filesystem needed)
    const base64 = optimized.toString('base64')
    const dataUrl = `data:image/webp;base64,${base64}`

    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

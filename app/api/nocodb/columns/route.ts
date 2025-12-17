import { NextRequest, NextResponse } from 'next/server'
import { nocoDbApiService as NocoDBService } from '@/lib/noco_api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source')

    if (!source) {
      return NextResponse.json({ error: 'Source parameter is required' }, { status: 400 })
    }

    const { baseId, tableId } = NocoDBService.parseSource(source)
    const columns = await NocoDBService.getColumns(baseId, tableId)

    return NextResponse.json({ columns })
  } catch (error) {
    console.error('Error in columns API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch columns' },
      { status: 500 },
    )
  }
}

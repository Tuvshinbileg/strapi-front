import { NextRequest, NextResponse } from 'next/server'

import { nocoDbApiService as NocoDBService } from '@/lib/noco_api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const where = searchParams.get('where')
    const sort = searchParams.get('sort')

    if (!source) {
      return NextResponse.json({ error: 'Source parameter is required' }, { status: 400 })
    }

    const { baseId, tableId } = NocoDBService.parseSource(source)
    const response = await NocoDBService.getRows(baseId, tableId, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      where: where || undefined,
      sort: sort || undefined,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in rows API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch rows' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, data } = body

    if (!source || !data) {
      return NextResponse.json(
        { error: 'Source and data parameters are required' },
        { status: 400 },
      )
    }

    const { baseId, tableId } = NocoDBService.parseSource(source)
    const newRow = await NocoDBService.createRow(baseId, tableId, data)

    return NextResponse.json({ row: newRow }, { status: 201 })
  } catch (error) {
    console.error('Error in create row API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create row' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, rowId, data } = body

    if (!source || rowId == null || !data) {
      return NextResponse.json(
        { error: 'Source, rowId, and data parameters are required' },
        { status: 400 },
      )
    }

    const { baseId, tableId } = NocoDBService.parseSource(source)
    const updatedRow = await NocoDBService.updateRow(baseId, tableId, rowId, data)

    return NextResponse.json({ row: updatedRow })
  } catch (error) {
    console.error('Error in update row API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update row' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, rowId } = body

    if (!source || rowId == null) {
      return NextResponse.json(
        { error: 'Source and rowId parameters are required' },
        { status: 400 },
      )
    }

    const { baseId, tableId } = NocoDBService.parseSource(source)
    await NocoDBService.deleteRow(baseId, tableId, rowId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete row API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete row' },
      { status: 500 },
    )
  }
}

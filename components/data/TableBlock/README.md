# TableBlock - Dynamic NocoDB CRUD System

## Overview

TableBlock is a fully dynamic CRUD (Create, Read, Update, Delete) component that integrates with NocoDB to provide table management capabilities directly within your Payload CMS frontend.

## Features

- ✅ **Automatic Schema Detection**: Reads table structure from NocoDB and generates forms dynamically
- ✅ **Full CRUD Operations**: Create, Read, Update, and Delete records
- ✅ **Type-Safe**: Built with TypeScript for type safety
- ✅ **Modern UI**: Uses ShadCN UI components with TailwindCSS
- ✅ **Real-time Feedback**: Toast notifications for all operations
- ✅ **Error Handling**: Comprehensive error states and messages
- ✅ **Server-Side Rendering**: Initial data fetched on the server for better performance

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
NOCODB_URL=https://your-nocodb-instance.com
NOCODB_API_TOKEN=your_api_token_here
```

You can obtain your API token from NocoDB:
1. Login to your NocoDB instance
2. Go to Account Settings → Tokens
3. Create a new API token or copy an existing one

### Usage

Use the TableBlock in your Payload CMS pages by providing a `source` parameter with just the table name:

```typescript
{
  blockType: 'tableBlock',
  source: 'tasks'
}
```

The `source` parameter is simply your table name. The system will automatically:
1. Search across all your NocoDB bases
2. Find the table matching the name (case-insensitive)
3. Load the table data

Example: `"tasks"`, `"customers"`, `"employees"`, `"products"`

**Note**: Table names are searched by both the display title and the internal table name. The first match found will be used.

## Architecture

### Components

- **Component.tsx** (Server Component): Main TableBlock component that fetches initial data
- **DataTable.tsx** (Client Component): Table display with CRUD actions
- **DynamicForm.tsx** (Client Component): Dynamic form generator for create/edit operations

### API Routes

- `GET /api/nocodb/columns?source={source}`: Fetch table columns/metadata
- `GET /api/nocodb/rows?source={source}`: Fetch table rows
- `POST /api/nocodb/rows`: Create a new row
- `PATCH /api/nocodb/rows`: Update an existing row
- `DELETE /api/nocodb/rows`: Delete a row

### Services

- **services/nocodb.ts**: Service wrapper for NocoDB API interactions

## Supported Field Types

The TableBlock automatically detects and handles the following NocoDB field types:

- **Text**: SingleLineText, LongText
- **Email**: Email fields with validation
- **URL**: URL fields
- **Phone**: PhoneNumber fields
- **Number**: Number, Decimal, Currency
- **Checkbox**: Boolean fields
- **Date**: Date fields
- **DateTime**: DateTime fields
- **Time**: Time fields

## Limitations & Future Enhancements

### Current Limitations
- Pagination is limited to 100 rows (can be configured)
- No sorting/filtering UI (data fetched unsorted)
- Relation fields and complex types not fully supported
- File upload fields not supported yet

### Planned Features
- [ ] Pagination controls
- [ ] Column sorting
- [ ] Search and filtering
- [ ] Bulk operations
- [ ] Support for relation fields
- [ ] File upload support
- [ ] Export to CSV/Excel

## Example

```tsx
// In your Payload CMS page or block:
<TableBlock source="customers" />
```

This will:
1. Automatically search all bases for a table named "customers"
2. Fetch the table structure from NocoDB
3. Display all records in a table
4. Provide UI to create, edit, and delete records
5. Automatically generate forms based on column types

## Development

To extend or modify the TableBlock:

1. **Add new field types**: Update `getInputType()` in `DynamicForm.tsx`
2. **Customize table display**: Modify `DataTable.tsx`
3. **Add new API features**: Extend `services/nocodb.ts`
4. **Change styling**: Update TailwindCSS classes or ShadCN components

## Troubleshooting

### "Error: No data source specified"
- Make sure you're passing the `source` prop to TableBlock
- Verify the format is `"baseId.tableId"`

### "Failed to fetch columns/rows"
- Check that `NOCODB_URL` and `NOCODB_API_TOKEN` are set correctly
- Verify your NocoDB instance is accessible
- Ensure the API token has proper permissions

### "Cannot find matching table"
- Verify the base ID and table ID are correct
- Check that the table exists in your NocoDB instance

## Security Notes

- API token is stored server-side only (not exposed to client)
- All NocoDB requests go through Next.js API routes
- Client never directly communicates with NocoDB

## License

Part of the Payload CMS template project.

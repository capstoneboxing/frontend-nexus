
# ApiErrorResponse

Standard API error response

## Properties

Name | Type
------------ | -------------
`timestamp` | Date
`status` | number
`error` | string
`message` | string

## Example

```typescript
import type { ApiErrorResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "timestamp": 2026-03-27T18:30:00Z,
  "status": 404,
  "error": Not Found,
  "message": Weight class not found: 11,
} satisfies ApiErrorResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiErrorResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



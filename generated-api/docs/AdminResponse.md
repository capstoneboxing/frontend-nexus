
# AdminResponse

Response containing admin account details

## Properties

Name | Type
------------ | -------------
`adminId` | number
`username` | string
`createdAt` | Date

## Example

```typescript
import type { AdminResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "adminId": 1,
  "username": tywaine,
  "createdAt": 2026-03-27T18:30:00Z,
} satisfies AdminResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



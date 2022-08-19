export function tryParseJSONObject(jsonString: string) {
  try {
    let o = JSON.parse(jsonString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}

  return jsonString;
}

export function tryParseJSONString(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {}

  return jsonString;
}

// export function parseGraphQlResponse(data: any) {
//   let _data:any = {};
//
//   // if(!data) return
//
//   Object.keys(data).forEach(function(key) {
//     try {
//       let o = JSON.parse(data[key]);
//
//       if (o && typeof o === "object") {
//         _data[key] = o;
//       }
//       else {
//         try {
//           _data[key] = JSON.parse(data[key]);
//         }
//         catch (e) { }
//       }
//     }
//     catch (e) { }
//   });
//
//   return _data
// }

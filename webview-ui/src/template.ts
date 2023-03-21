export const explainTemplate = (material: string) => `
# language: Python

def sum_squares(lst):
    sum = 0
    for i in range(len(lst)):
        if i % 3 == 0:
            lst[i] = lst[i]**2
        elif i % 4 == 0:
            lst[i] = lst[i]**3
        sum += lst[i]
    return sum

${material}

# Explain the code line by line
def sum_squares(lst):
    # initialize sum
    sum = 0
    # loop through the list
    for i in range(len(lst)):
        # if the index is a multiple of 3
        if i % 3 == 0:
            # square the entry
            lst[i] = lst[i]**2
        # if the index is a multiple of 4
        elif i % 4 == 0:
            # cube the entry
            lst[i] = lst[i]**3
        # add the entry to the sum
        sum += lst[i]
    # return the sum
    return sum

# Explain the code line by line
`;

export const debugTemplate = (material: string) => `
// language: Javascript
function bisectLeft(a, x, lo, hi) {
  if (lo == null) lo = 0;
  if (hi == null) hi = a.length;
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (ascending(a[mid], x) < 0) lo = mid + 1; else hi = mid;
  }
  return lo;
}

${material}

// Add debugging statements
function bisectLeft(a, x, lo, hi) {
  console.log("x = ", x, "lo = ", lo, "hi = ", hi);
  if (lo == null) lo = 0;
  if (hi == null) hi = a.length;
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    console.log("x = ", x, "lo = ", lo, "hi = ", hi, "mid = ", mid);
    if (ascending(a[mid], x) < 0) lo = mid + 1; else hi = mid;
  }
  return lo;
}

// Add debugging statements
`

export const addTypesTemplate = (material: string) => `
// language: TypeScript

function sum(array) {
  return array.reduce((acc, cur) => acc + cur, 0);
}


${material}

// add types
function sum(array: number[]): number {
  return array.reduce((acc: number, cur: number) => acc + cur, 0);
}

// add types
`
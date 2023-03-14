import{c as g,j as t,R as x,r as s,a as c,d as l,e as E}from"./index.js";/* empty css      */const b=e=>`
// language: TypeScript

function sum(array) {
  return array.reduce((acc, cur) => acc + cur, 0);
}


${e}

// add types
function sum(array: number[]): number {
  return array.reduce((acc: number, cur: number) => acc + cur, 0);
}

// add types
`,S=e=>`
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

${e}

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
`;let a;typeof acquireVsCodeApi=="function"&&(a=acquireVsCodeApi());function T(){const[e,d]=s.useState("please selected text"),[u,m]=s.useState(""),[p,n]=s.useState(!1),r=h=>{const{command:i,payload:o}=h.data;i==="codegeex.selectedText"?d(o):i==="codegeex.templateResult"&&(n(!1),m(o))},f=()=>{n(!0),a.postMessage({command:"codegeex.template",payload:{code:b(e)}})},y=()=>{n(!0),a.postMessage({command:"codegeex.template",payload:{code:S(e)}})};return s.useEffect(()=>(window.addEventListener("message",r),()=>{window.removeEventListener("message",r)}),[]),c("main",{children:[t("pre",{children:e}),c("div",{className:"btn-container",children:[t(l,{appearance:"secondary",onClick:f,children:"TS: Add Types"}),t(l,{appearance:"secondary",onClick:y,children:"Python: Explain"})]}),p&&t(E,{}),t("pre",{children:u})]})}g.createRoot(document.getElementById("root")).render(t(x.StrictMode,{children:t(T,{})}));

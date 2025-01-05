export const handleResponse = (response: any, toDoFnx: () => any) => {
    if (!response.status || response.status >= 400) toDoFnx()
}
export function sleep(time: number) {
    console.log('sleeping for', time)
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function generateSheetTitle(): string{
    const date = new Date();
    return date.toDateString()
}
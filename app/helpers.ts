export function convertDateToSbFormat(dateString: string): string {
    // Parse the input date string
    const date = new Date(dateString);

    // Extract year, month, day, hours, and minutes
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Construct the output date string in the desired format
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDate;
}
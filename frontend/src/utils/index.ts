import moment from "moment";
import { nanoid } from "nanoid";

export function isEmail(text: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
}

export function formatArea(number: number) {
    return number.toLocaleString("de-DE") + "  m2";
}

export function formatTimeString(date: Date) {
    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} lúc ${date.getHours()}:${date.getMinutes()}`;
}

export function countdownDaysInVietnamese(targetDate: Date) {
    const today = moment();
    const difference = moment.duration(moment(targetDate).diff(today));

    // Check if target date is in the future (positive duration)
    if (difference.asDays() > 0) {
        return `${Math.floor(difference.asDays())} ngày`;
    } else {
        return "";
    }
}

export function isBefore(dateStr: string, refTimeString = "now") {
    // Try parsing the date string
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
        return null; // Handle invalid date format
    }

    // Get the current date if reference time is "now"
    const now = refTimeString === "now" ? new Date() : refTimeString;

    // Check if reference time is a valid Date object
    if (!(now instanceof Date)) {
        return null; // Handle invalid reference time format
    }

    // Compare dates (ignoring time)
    const yearDiff = dateObj.getFullYear() - now.getFullYear();
    const monthDiff = dateObj.getMonth() - now.getMonth();
    const dayDiff = dateObj.getDate() - now.getDate();

    return (
        yearDiff < 0 ||
        (yearDiff === 0 && monthDiff < 0) ||
        (yearDiff === 0 && monthDiff === 0 && dayDiff < 0)
    );
}

export function daysBetween(date1Str: string, date2Str: string = "now") {
    // Try parsing the date strings
    let date1 = new Date(date1Str);
    let date2 = date2Str == "now" ? new Date() : new Date(date2Str);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return null; // Handle invalid date format
    }

    // Ensure date1 is before date2 for easier calculation
    if (date1 > date2) {
        [date1, date2] = [date2, date1];
    }

    // Get the millisecond difference and convert to days
    const diffInMs = date2.getTime() - date1.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

export function formatVietnameseCurrency(
    number: number,
    withPrefix: boolean = true,
    shouldFormatMil = false
) {
    // Check if the input is a valid number
    if (isNaN(number)) {
        return "Invalid number";
    }

    const prefix = "đ";
    let text = "";
    // Handle negative numbers
    const isNegative = number < 0;
    number = Math.abs(number);

    // Convert to billion if number is greater than or equal to 1 billion
    const billion = Math.floor(number / 1000000000);
    if (billion >= 1) {
        // const remainder = number / 1000000000 - billion;
        text = number / 1000000000 + " tỷ";
    } else {
        text = number.toLocaleString("de-DE");
    }

    let formattedValue = prefix + " " + text;
    if (!withPrefix) {
        formattedValue = text;
    }

    // Add negative sign if necessary
    if (isNegative) {
        formattedValue = `-${formattedValue}`;
    }

    return formattedValue;
}

export function censorePhone(phone: string) {
    return phone.replace(/^.{1,4}/g, (match) => match.replace(/./g, "*"));
}

export function censoreUsername(username: string) {
    return username.replace(/^.{1,3}/g, (match) => match.replace(/./g, "*"));
}

export function decimalSeperatorFormat(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getAverageRating(ratings: Record<number, number>) {
    // Check if the ratings object is empty
    if (Object.keys(ratings).length === 0) {
        return 0.0;
    }

    // Reduce the ratings object to get the sum of (rating * count) for each rating
    const totalRating = Object.entries(ratings).reduce(
        (acc, [rating, count]) => acc + (rating as any) * count,
        0
    );

    // Reduce the ratings object to get the sum of counts for all ratings
    const totalCount = Object.values(ratings).reduce(
        (acc, count) => acc + count,
        0
    );

    // Calculate the average rating by dividing total rating by total count
    const averageRating = totalRating / totalCount;

    return averageRating;
}

export function removeEmpty(obj: object) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
    );
}

export function getNameFirstLetters(name?: string, maxLength = 2) {
    if (!name) return "";
    // Get the first letter of each word in the name
    const nameParts = name.split(" ");
    const firstLetters = nameParts.map((part) => part[0]?.toUpperCase());
    // Return the last `maxLength` letters
    return firstLetters.join("").slice(0, maxLength);
}

export const jsonToObjectArray = (json: Record<string, any>) => {
    return Object.keys(json || {}).map((key) => ({
        key,
        value: json[key],
        id: nanoid(),
    }));
};

export const objectArrayToJson = (array: { key: string; value: string }[]) => {
    return array.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
};

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toSearchParams(json: Record<string, unknown>): string {
    const params = new URLSearchParams();

    Object.entries(json).forEach(([key, value]) => {
        if (typeof value === "object") {
            params.set(key, JSON.stringify(value));
            return;
        }

        if (typeof value === "boolean") {
            params.set(key, String(Number(value)));
            return;
        }

        params.set(key, String(value));
    });

    return params.toString();
}

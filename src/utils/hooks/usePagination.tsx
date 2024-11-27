export default function usePagination(
    currentPage: number,
    lastPage: number,
    nodes: number,
): (number | typeof NaN)[] {
    if (lastPage <= 1) {
        return [1];
    }
    const pages = [];
    if (lastPage <= nodes) {
        for (let i = 1; i <= lastPage; i++) {
            pages.push(i);
        }
    } else {
        const half = Math.floor(nodes / 2);
        if (currentPage <= half) {
            for (let i = 1; i <= nodes - 1; i++) {
                pages.push(i);
            }
            pages.push(NaN);
            pages.push(lastPage);
        } else if (currentPage >= lastPage - half) {
            pages.push(1);
            pages.push(NaN);
            for (let i = lastPage - nodes + 2; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            pages.push(NaN);
            for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
                pages.push(i);
            }
            pages.push(NaN);
            pages.push(lastPage);
        }
    }
    return pages;
}

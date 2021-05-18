export type Book = {
    id: string,

    name: string,
    year: number,

    author: string,
    summary: string,
    publisher: string,

    pageCount: number,
    readPage: number,

    finished: boolean,
    reading: boolean,

    insertedAt: string,
    updatedAt: string
};
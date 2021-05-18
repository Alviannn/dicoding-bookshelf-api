const books = require('./books');
const { nanoid } = require('nanoid');

/** @type {import('@hapi/hapi').Lifecycle.Method} */
function saveBookHandler(req, h) {
    const body = req.payload;
    const currentDate = new Date().toISOString();

    try {
        if (!body.name || body.readPage > body.pageCount) {
            const status = 'fail';
            const message = 'Gagal menambahkan buku.'
                + ((!body.name) ? ' Mohon isi nama buku' : ' readPage tidak boleh lebih besar dari pageCount');

            return h.response({
                status,
                message
            }).code(400);
        }

        const { name, year, author, summary, publisher, pageCount, readPage, reading } = body;

        /** @type {import('../types').Book} */
        const newBook = {
            name, year, author, summary, publisher, pageCount, readPage, reading,
            id: nanoid(16),
            insertedAt: currentDate,
            updatedAt: currentDate,
            finished: body.readPage === body.pageCount
        };

        books.push(newBook);

        const isAdded = books.filter(b => b.id === newBook.id).length > 0;
        if (!isAdded) {
            throw Error('Failed to add new book!');
        }

        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: newBook.id
            }
        }).code(201);
    } catch (err) {
        console.log(err);
        return h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        }).code(500);
    }
}

// ------------------------------------------------------------------- //

/** @type {import('@hapi/hapi').Lifecycle.Method} */
function viewBooksHandler(req, h) {
    let { name = null, reading = null, finished = null } = req.query;

    /** @param {import('../types').Book[]} arr */
    function mappedBooks(arr) {
        return arr.map(b => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher
        }));
    }

    let tempBooks = mappedBooks(books);
    try {
        if (name !== null) {
            tempBooks = mappedBooks(books.filter(b => b.name.toLowerCase().includes(name.toLowerCase())));
        } else if (reading !== null) {
            reading = parseInt(reading);

            if (reading === 1) {
                tempBooks = mappedBooks(books.filter(b => !!b.reading));
            } else if (reading === 0) {
                tempBooks = mappedBooks(books.filter(b => !b.reading));
            }
        } else if (finished !== null) {
            finished = parseInt(finished);

            if (finished === 1) {
                tempBooks = mappedBooks(books.filter(b => !!b.finished));
            } else if (finished === 0) {
                tempBooks = mappedBooks(books.filter(b => !b.finished));
            }
        }
    } catch (_) {
        // nothing
    }

    return h.response({
        status: 'success',
        data: {
            books: tempBooks
        }
    });
}

// ------------------------------------------------------------------- //

/** @type {import('@hapi/hapi').Lifecycle.Method} */
function viewBookByIdHandler(req, h) {
    const { bookId } = req.params;

    const foundBook = books.find(b => b.id === bookId);
    if (!foundBook) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book: foundBook
        }
    }).code(200);
}

// ------------------------------------------------------------------- //

/** @type {import('@hapi/hapi').Lifecycle.Method} */
function editBookByIdHandler(req, h) {
    const { bookId } = req.params;

    const idx = books.findIndex(b => b.id === bookId);
    if (idx === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }

    const body = req.payload;
    const currentDate = new Date().toISOString();

    try {
        if (!body.name || body.readPage > body.pageCount) {
            const status = 'fail';
            const message = 'Gagal memperbarui buku.'
                + ((!body.name) ? ' Mohon isi nama buku' : ' readPage tidak boleh lebih besar dari pageCount');

            return h.response({
                status,
                message
            }).code(400);
        }

        const { name, year, author, summary, publisher, pageCount, readPage, reading } = body;
        books[idx] = {
            ...books[idx],
            name, year, author, summary, publisher, pageCount, readPage, reading,
            updatedAt: currentDate,
            finished: body.readPage === body.pageCount
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    } catch (_) {
        return h.response({
            status: 'error',
            message: 'Buku gagal diperbarui'
        }).code(500);
    }
}

// ------------------------------------------------------------------- //

/** @type {import('@hapi/hapi').Lifecycle.Method} */
function deleteBookByIdHandler(req, h) {
    const { bookId } = req.params;

    const idx = books.findIndex(b => b.id === bookId);
    if (idx === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
    }

    books.splice(idx, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    }).code(200);
}

module.exports = {
    saveBookHandler,
    viewBooksHandler,
    viewBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
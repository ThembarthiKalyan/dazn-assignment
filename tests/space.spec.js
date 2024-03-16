const request = require("supertest");
const app = require("../dist/app");

// change this object while each execution of test file
const movieObj = {
    title: 'dalapathi',
    genre: 'family drama',
    rating: '5',
    link: 'https://youtu.be/rK4pb4gJv8M?si=_t88pBJ4-u7enbCm'
}

describe("Space test suite", () => {

    it("Get request", async () => {
        const response = await request(app).get('/movies');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("Get search request", async () => {
        const response = await request(app).get('/search');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("Post request", async () => {
        const response = await request(app).post('/movies')
            .set("role", "Admin")
            .send(movieObj);
        expect(response.body.data).toBeDefined();
    });

    it("Put request", async () => {
        const response = await request(app).put('/movies/65f48cc692f8f3d62eabd764')
            .set("role", "Admin")
            .send({ "title": "Hey Ram" });
        expect(response.body.message).toBe("Movie data updated");
    })

    it("Delete request", async () => {
        const response = await request(app).delete('/movies/65f48cc692f8f3d62eabd764')
            .set("role", "Admin");
        expect(response.body.message).toBe("Movie deleted successfully");
    })

});
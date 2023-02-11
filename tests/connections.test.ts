import { createMocks } from "node-mocks-http";
import getConnectionsHandler from "@/pages/api/v1/connections";

describe("/api/v1/connections", () => {
	it("should return 400 when from or to are missing", async () => {
		const { req, res } = createMocks({ method: "GET" });

		// @ts-ignore: we don't care about req type here
		await getConnectionsHandler(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toEqual({
			from: "Required `from` must be a non-blank string",
			to: "Required `to` must be a non-blank string",
		});
	});

	it("should return 400 when there is a non-numeric value for limit or page", async () => {
		const { req, res } = createMocks({
			method: "GET",
			query: {
				from: "winterthur",
				to: "zurich",
				limit: "dj8",
				page: "p33",
			},
		});

		// @ts-ignore
		await getConnectionsHandler(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toEqual({
			limit: "`limit` must be a valid number",
			page: "`page` must be a valid number",
		});
	});

	it("should return 200 otherwise", async () => {
		const { req, res } = createMocks({
			method: "GET",
			query: {
				from: "winterthur",
				to: "zurich",
			},
		});

		// @ts-ignore
		await getConnectionsHandler(req, res);

		expect(res.statusCode).toBe(200);
	});
});

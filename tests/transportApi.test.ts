import { getConnections, getLocations } from "@/interfaces/transport";

describe("Get  locations", () => {
	it("should return results given a query", async () => {
		const result = await getLocations({
			query: "winterthur",
			type: "all",
		});
		expect(result).toBeTruthy();
	});
});

describe("Get connections", () => {
	it("should return connections give a from and to, with default pagination", async () => {
		const result = await getConnections({
			from: "winterthur",
			to: "zurich",
		});
		const resultCount = result.connections.length;
		expect(resultCount).toBeGreaterThanOrEqual(1);
	});
	it("should return connections give a from and to, with custom pagination", async () => {
		const result = await getConnections({
			from: "winterthur",
			to: "zurich",
			limit: 1,
			page: 2,
		});
		const resultCount = result.connections.length;
		expect(resultCount).toBe(1);
	});
});

import React from "react";
import { SWRConfig } from "swr";
import { TransitSearch } from "@/components/TransitSearch";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
	return (
		<SWRConfig value={{ refreshInterval: 30000, fetcher: fetcher }}>
			<TransitSearch />
		</SWRConfig>
	);
}

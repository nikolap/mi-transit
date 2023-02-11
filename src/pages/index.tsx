import React, { useMemo, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { AutoComplete, Button, Input } from "antd";
import useDebounce from "@/components/useDebounce";

const content = {
	marginTop: "32px",
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface Station {
	id: string;
	name: string;
	icon: string;
}

interface LocationSearchResults {
	stations: Station[];
}

function locationSearchResultsToOptions(results?: LocationSearchResults) {
	if (results) {
		const stations = results.stations || [];
		return stations.map((station: Station) => {
			return {
				label: station.name,
				value: station.id,
			};
		});
	}
	return [];
}

function SearchInput() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const searchDebounceMs = 600;
	const debouncedFrom = useDebounce(from, searchDebounceMs);
	const debouncedTo = useDebounce(to, searchDebounceMs);

	const { data: fromAutocomplete } = useSWR(
		debouncedFrom.length > 3 && `/api/v1/locations?query=${debouncedFrom}`,
		{ refreshInterval: 0 },
	);
	const { data: toAutocomplete } = useSWR(
		debouncedTo.length > 3 && `/api/v1/locations?query=${debouncedTo}`,
		{ refreshInterval: 0 },
	);

	console.log(fromAutocomplete);

	const fromAutocompleteOptions = useMemo(
		() => locationSearchResultsToOptions(fromAutocomplete),
		[fromAutocomplete],
	);
	const toAutocompleteOptions = useMemo(
		() => locationSearchResultsToOptions(toAutocomplete),
		[toAutocomplete],
	);

	return (
		<div style={content}>
			<AutoComplete
				options={fromAutocompleteOptions}
				style={{ width: 200 }}
				placeholder="from"
				onChange={(value) => setFrom(value)}
				onSelect={(_, option) => setFrom(option.label)}
				value={from}
			/>
			<AutoComplete
				options={toAutocompleteOptions}
				style={{ width: 200 }}
				placeholder="to"
				onChange={(value) => setTo(value)}
				onSelect={(_, option) => setTo(option.label)}
				value={to}
			/>
			<Button>Search</Button>
		</div>
	);
}

export default function Home() {
	return (
		<SWRConfig value={{ refreshInterval: 30000, fetcher: fetcher }}>
			<SearchInput />
		</SWRConfig>
	);
}

import React, { useCallback, useMemo, useState } from "react";
import useDebounce from "@/components/useDebounce";
import useSWR from "swr";
import { AutoComplete, Button } from "antd";
import {
	ConnectionSearchParams,
	Station,
} from "@/components/TransitSearch/types";

const defaultSearchParams = {
	limit: 4,
	page: 0,
};

interface SearchInputProps {
	setConnectionSearchParams: (params: ConnectionSearchParams) => void;
}

function locationSearchResultsToOptions(results?: Station[]) {
	if (results) {
		const stations = results || [];
		return stations.map((station: Station) => {
			return {
				label: station.name,
				value: station.id,
			};
		});
	}
	return [];
}

function SearchInput({ setConnectionSearchParams }: SearchInputProps) {
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

	const fromAutocompleteOptions = useMemo(
		() => locationSearchResultsToOptions(fromAutocomplete),
		[fromAutocomplete],
	);
	const toAutocompleteOptions = useMemo(
		() => locationSearchResultsToOptions(toAutocomplete),
		[toAutocomplete],
	);

	const searchButtonEnabled = useMemo(
		() => from.length > 0 && to.length > 0,
		[from, to],
	);

	const onClickSearch = useCallback(() => {
		if (searchButtonEnabled) {
			setConnectionSearchParams({
				...defaultSearchParams,
				from: from,
				to: to,
			});
		}
	}, [setConnectionSearchParams, searchButtonEnabled, from, to]);

	return (
		<>
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
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						onClickSearch();
					}
				}}
			/>
			<Button disabled={!searchButtonEnabled} onClick={onClickSearch}>
				Search
			</Button>
		</>
	);
}

export { SearchInput };

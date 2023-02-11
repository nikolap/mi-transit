import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { AutoComplete, Button, List, Space, Spin, Timeline } from "antd";
import useDebounce from "@/components/useDebounce";

const content = {
	marginTop: "32px",
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface ConnectionSearchParams {
	from: string;
	to: string;

	limit?: number;
	page?: number;
}

const defaultSearchParams = {
	limit: 4,
	page: 0,
};

interface SearchInputProps {
	setConnectionSearchParams: (params: ConnectionSearchParams) => void;
}

interface Station {
	id: string;
	name: string;
	icon?: string;
}

function locationSearchResultsToOptions(results?: Station[]) {
	if (results) {
		return results.map((station: Station) => {
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

	const onClickSearch = useCallback(() => {
		setConnectionSearchParams({
			...defaultSearchParams,
			from: from,
			to: to,
		});
	}, [setConnectionSearchParams, from, to]);

	const searchButtonEnabled = useMemo(
		() => from.length > 0 && to.length > 0,
		[from, to],
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
			<Button disabled={!searchButtonEnabled} onClick={onClickSearch}>
				Search
			</Button>
		</div>
	);
}

interface Prognosis {
	platform: string | null;
	departure: string | null;
	arrival: string | null;
	capacity1st: string | null;
	capacity2nd: string | null;
}

interface Checkpoint {
	station: Station;
	arrival: string | null;
	departure: string | null;
	delay?: string | null;
	platform: string | null;
	prognosis?: Prognosis | null;
}

interface Journey {
	name: string;
	category: string;
	categoryCode: string;
	number: string;
	operator: string;
	to: string;
	passList: Checkpoint[];
	capacity1st: string;
	capacity2nd: string;
}

interface Section {
	journey: Journey;
	walk: string | null;
	departure: Checkpoint;
	arrival: Checkpoint;
}

interface Connection {
	from: Checkpoint;
	to: Checkpoint;
	duration: string | null;
	transfers?: number | null;
	products: string[] | null;
	capacity1st: string | null;
	capacity2nd: string | null;
	sections: Section[];
}

interface SearchResultsProps {
	connectionsSearchParams: ConnectionSearchParams | undefined;
	setConnectionSearchParams: (params: ConnectionSearchParams) => void;
}

interface ConnectionListItemProps {
	connection: Connection;
}

function connectionTitle(connection: Connection) {
	return (
		<>{`[${connection.transfers}] ${connection.products?.join(" -> ")}`}</>
	);
}

function connectionDescriptionHeadline(connection: Connection) {
	return (
		<div>
			{`${connection.from?.departure} - ${connection.to?.arrival} (${connection.duration})`}
		</div>
	);
}

function connectionDescription(
	connection: Connection,
	areDetailsShown: boolean,
) {
	if (areDetailsShown) {
		const sections = connection.sections;

		const items = sections
			.map((section) => {
				const { journey, departure, arrival } = section;

				return [
					{
						label: departure.departure,
						children: `[${[journey.operator, journey.category, journey.number]
							.filter((x) => x)
							.join(" ")}] ${departure.station.name} platform 
							${departure.platform}`,
						color: "red",
					},
					{
						label: arrival.arrival,
						children: `${arrival.station.name} platform ${arrival.platform}`,
						color: "green",
					},
				];
			})
			.flat();
		return (
			<Space direction={"vertical"} size={"large"}>
				{connectionDescriptionHeadline(connection)}
				<Timeline mode={"left"} items={items} />
			</Space>
		);
	} else {
		return <>{connectionDescriptionHeadline(connection)}</>;
	}
}

function ConnectionListItem({ connection }: ConnectionListItemProps) {
	const [areDetailsShown, setAreDetailsShown] = useState(false);

	return (
		<List.Item>
			<List.Item.Meta
				title={connectionTitle(connection)}
				description={connectionDescription(connection, areDetailsShown)}
			/>
			<Button
				type={"link"}
				onClick={() => setAreDetailsShown(!areDetailsShown)}
			>
				{areDetailsShown ? "Hide" : "Details"}
			</Button>
		</List.Item>
	);
}

function SearchResults({
	connectionsSearchParams,
	setConnectionSearchParams,
}: SearchResultsProps) {
	const [loading, setLoading] = useState(false);
	const { data: connectionsResults } = useSWR(
		connectionsSearchParams &&
			`/api/v1/connections?${new URLSearchParams(
				connectionsSearchParams as unknown as Record<string, string>,
			).toString()}`,
	);

	useEffect(() => {
		setLoading(true);
	}, [connectionsSearchParams]);

	useEffect(() => {
		setLoading(false);
	}, [connectionsResults]);

	const onLoadMore = useCallback(() => {
		if (connectionsSearchParams) {
			setConnectionSearchParams({
				...connectionsSearchParams,
				page: (connectionsSearchParams.page || 0) + 1,
			});
		}
	}, [connectionsSearchParams, setConnectionSearchParams]);

	const loadMore = useMemo(() => {
		return !loading ? (
			<div
				style={{
					textAlign: "center",
					marginTop: 12,
					height: 32,
					lineHeight: 32,
				}}
			>
				<Button onClick={onLoadMore}>More</Button>
			</div>
		) : null;
	}, [loading, onLoadMore]);

	console.log(connectionsResults);

	return connectionsSearchParams ? (
		<List
			loading={loading}
			itemLayout="horizontal"
			loadMore={loadMore}
			dataSource={(connectionsResults as Connection[]) || []}
			renderItem={(connection) => (
				<ConnectionListItem connection={connection} />
			)}
		/>
	) : (
		<></>
	);
}

function TransitSearch() {
	const [connectionsSearchParams, setConnectionSearchParams] =
		useState<ConnectionSearchParams>();

	return (
		<>
			<SearchInput setConnectionSearchParams={setConnectionSearchParams} />
			<SearchResults
				connectionsSearchParams={connectionsSearchParams}
				setConnectionSearchParams={setConnectionSearchParams}
			/>
		</>
	);
}

export default function Home() {
	return (
		<SWRConfig value={{ refreshInterval: 30000, fetcher: fetcher }}>
			<TransitSearch />
		</SWRConfig>
	);
}

import { Button, List, Space, Timeline } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
	Connection,
	ConnectionSearchParams,
} from "@/components/TransitSearch/types";

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
		{ refreshInterval: 0 },
	);
	const [listData, setListData] = useState<Connection[]>([]);

	useEffect(() => {
		setLoading(true);
	}, [connectionsSearchParams]);

	useEffect(() => {
		setLoading(false);
		if (connectionsResults) {
			if (connectionsSearchParams?.page === 0) {
				setListData(connectionsResults);
			} else {
				setListData((prevState) => prevState.concat(connectionsResults));
			}
		}
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
					lineHeight: "32px",
				}}
			>
				<Button onClick={onLoadMore}>More</Button>
			</div>
		) : null;
	}, [loading, onLoadMore]);

	return connectionsSearchParams ? (
		<List
			loading={loading}
			itemLayout="horizontal"
			loadMore={loadMore}
			dataSource={listData}
			renderItem={(connection) => (
				<ConnectionListItem connection={connection} />
			)}
		/>
	) : (
		<></>
	);
}

export { SearchResults };

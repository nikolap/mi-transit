import { Button, List, Space, Timeline, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
	Checkpoint,
	Connection,
	ConnectionSearchParams,
	Section,
} from "@/components/TransitSearch/types";

interface SearchResultsProps {
	connectionsSearchParams: ConnectionSearchParams | undefined;
	setConnectionSearchParams: (params: ConnectionSearchParams) => void;
}

interface ConnectionListItemProps {
	connection: Connection;
}

function connectionTitle(connection: Connection) {
	if (connection.transfers)
		return (
			<>{`[${connection.transfers}] ${connection.products?.join(" -> ")}`}</>
		);
	else return <>{connection.products?.join(" -> ")}</>;
}

function connectionDescriptionHeadline(connection: Connection) {
	return (
		<div>
			{`${connection.from?.departure} - ${connection.to?.arrival} (${connection.duration})`}
		</div>
	);
}

function connectionName({ journey, walk }: Section) {
	if (journey)
		return `[${[journey.operator, journey.category, journey.number]
			.filter((x) => x)
			.join(" ")}] `;
	else if (walk) {
		return "[walk] ";
	}
	return "";
}

function connectionPlatform({ platform }: Checkpoint) {
	if (platform) return ` platform ${platform}`;
	else return "";
}

function connectionDescription(
	connection: Connection,
	areDetailsShown: boolean,
) {
	if (areDetailsShown) {
		const sections = connection.sections;

		const items = sections
			.map((section) => {
				const { departure, arrival } = section;
				return [
					{
						label: departure.departure,
						children: (
							<>
								{connectionName(section)}
								{departure.station.name}
								{connectionPlatform(departure)}
							</>
						),
						color: "red",
					},
					{
						label: arrival.arrival,
						children: `${arrival.station.name}${connectionPlatform(arrival)}`,
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
		<div style={{ paddingTop: 36 }}>
			<Typography.Title level={2}>Results</Typography.Title>
			<List
				loading={loading}
				itemLayout="horizontal"
				loadMore={loadMore}
				dataSource={listData}
				renderItem={(connection) => (
					<ConnectionListItem connection={connection} />
				)}
				style={{ maxWidth: 768 }}
			/>
		</div>
	) : (
		<></>
	);
}

export { SearchResults };

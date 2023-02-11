import React from "react";
import { SWRConfig } from "swr";
import { TransitSearch } from "@/components/TransitSearch";
import { Layout, Typography } from "antd";
import Head from "next/head";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
	return (
		<>
			<Head>
				<title>MiTransit</title>
				<meta name="description" content="Transit search in Switzerland" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<SWRConfig value={{ refreshInterval: 30000, fetcher: fetcher }}>
				<Layout>
					<Layout.Content style={{ padding: "16px 64px" }}>
						<Typography.Title>MiTransit</Typography.Title>
						<Typography.Paragraph>
							Powered by&nbsp;
							<Typography.Link
								href={"https://transport.opendata.ch/"}
								target={"_blank"}
							>
								https://transport.opendata.ch/
							</Typography.Link>
						</Typography.Paragraph>
						<TransitSearch />
					</Layout.Content>
					<Layout.Footer style={{ textAlign: "center" }}>
						<Typography.Link
							href={"https://github.com/nikolap/mi-transit"}
							target={"_blank"}
						>
							MiTransit ©2023 Nikola Peric
						</Typography.Link>
					</Layout.Footer>
				</Layout>
			</SWRConfig>
		</>
	);
}

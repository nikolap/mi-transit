import React, { useState } from "react";
import { ConnectionSearchParams } from "@/components/TransitSearch/types";
import { SearchResults } from "@/components/TransitSearch/SearchResults";
import { SearchInput } from "@/components/TransitSearch/SearchInput";

const contentStyle = {
	marginTop: "32px",
};

function TransitSearch() {
	const [connectionsSearchParams, setConnectionSearchParams] =
		useState<ConnectionSearchParams>();

	return (
		<div style={contentStyle}>
			<SearchInput setConnectionSearchParams={setConnectionSearchParams} />
			<SearchResults
				connectionsSearchParams={connectionsSearchParams}
				setConnectionSearchParams={setConnectionSearchParams}
			/>
		</div>
	);
}

export { TransitSearch };

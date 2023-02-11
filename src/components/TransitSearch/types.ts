interface ConnectionSearchParams {
	from: string;
	to: string;

	limit?: number;
	page?: number;
}

interface Station {
	id: string;
	name: string;
	icon?: string;
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

export type {
	ConnectionSearchParams,
	Connection,
	Section,
	Journey,
	Checkpoint,
	Prognosis,
	Station,
};

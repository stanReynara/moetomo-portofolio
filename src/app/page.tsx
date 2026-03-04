import Card from "@components/Card";
import Hero from "@components/Hero";
import Menu from "@components/Menu";

export default function Main() {
	return (
		<>
			<Hero/>
			<div className="flex flex-wrap justify-center gap-24 px-4 py-8 mb-16">
				<Card title="Noe" description="Description for Noe" imageSrc="/noe.png" socials={{ twitter: "#", instagram: "#" }} />
				<Card title="Toshi" description="Description for Toshi" imageSrc="/tosh.png" socials={{ twitter: "#", instagram: "#" }} />
				<Card title="Mogyiu" description="Description for Mogyiu" imageSrc="/mog.png" socials={{ twitter: "#", instagram: "#" }} />
			</div>
			<h2 className="text-3xl font-bold text-center">Menu for the Day</h2>
			<div className="grid grid-cols-3 place-items-center gap-24 px-4 py-8 mb-16">
				<Menu />
				<Menu />
				<Menu />
				<Menu />
				<Menu />
				<Menu />
				<Menu />
				<Menu />
				<Menu />
			</div>
		</>
	);
}

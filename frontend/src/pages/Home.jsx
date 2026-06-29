import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FolderButton from "../components/FolderButton";
import StatsCard from "../components/StatsCard";

function Home() {
  return (
    <main>
      <Header />
      <SearchBar />
      <FolderButton />
      <StatsCard />
    </main>
  );
}

export default Home;
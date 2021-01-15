import { useContext } from "react";

import AppContext from "../../AppContext";
import Dashboard from "../../components/Dashboard/Dashboard";
import EntriesTable from "../../components/EntriesTable/EntriesTable";
import PortfolioMenuBar from "../../components/PortfolioMenuBar/PortfolioMenuBar";
import { PORTFOLIO_DISPLAY } from "../../utilities/constants";
import "./Portfolio.scss";

function Portfolio() {
  const { user, portfolioSettings } = useContext(AppContext);

  return (
    <div className="Portfolio">
      {user && <PortfolioMenuBar />}

      {portfolioSettings.display === PORTFOLIO_DISPLAY.BOARD.name && (
        <Dashboard />
      )}

      {portfolioSettings.display === PORTFOLIO_DISPLAY.TABLE.name && (
        <EntriesTable />
      )}
    </div>
  );
}

export default Portfolio;

const Header = ({ onSearch }) => {
    return (
        <header className="header">
            <h1 className="header-title">Smart Transport</h1>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search route..." 
                    onChange={(e) => onSearch(e.target.value)}
                />
                {/* <select onChange={(e) => onFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="metro">Metro</option>
                </select> */}
            </div>
        </header>
    );
};

export default Header;

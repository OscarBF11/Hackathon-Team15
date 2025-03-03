import "../style/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Smart Transport. All rights reserved.</p>
        </footer>
    );
};

export default Footer;

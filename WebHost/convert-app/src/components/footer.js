import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content has-text-centered">&copy; {new Date().getFullYear()} - Itsjit</div>
      <nav className="level">
        <div className="level-item has-text-centered">
          <div>
            <a href="mailto:itsthejit@gmail.com">
              <span className="icon is-large">
                <i className="fas fa-envelope fa-3x"></i>
              </span>
            </a>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="XRU8BVY737BTS" />
              <input type="hidden" name="currency_code" value="CZK" />
              <input
                type="image"
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                border="0"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
              />
            </form>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <a href="https://github.com/itsjit/Xls2Json">
              <span className="icon is-large">
                <i className="fab fa-github fa-3x"></i>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;

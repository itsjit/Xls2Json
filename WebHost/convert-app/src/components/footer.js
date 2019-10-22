import React from 'react';
import { Header, Icon, Grid, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Segment basic textAlign="center">
      <Header>&copy; {new Date().getFullYear()} - Itsjit</Header>
      <Grid centered stackable columns={3}>
        <Grid.Column textAlign="center">
          <Segment basic>
            <a href="mailto:itsthejit@gmail.com">
              <Icon name="mail" size="huge" />
            </a>
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic>
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
                  title={t('PayPal - The safer, easier way to pay online!')}
                  alt={t('Donate with PayPal button')}
                />
              </form>
            </div>
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic>
            <a href="https://github.com/itsjit/Xls2Json">
              <Icon name="github" size="huge" />
            </a>
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default Footer;

import React from "react";
import translator from "../../i18config";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {

  const {t} = useTranslation()
  const changeLanguage = (selectedLanguage) => {
    localStorage.setItem("language",selectedLanguage);
    translator.changeLanguage(selectedLanguage);
  };

  return (
    <Dropdown  title="languageSwitcher">
      <Dropdown.Toggle  title="toogleTitleLanguage">
        
       
        {translator.language === "en" ? ("English") : t("Japanese")}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ minWidth: "unset", padding: "0.20rem 0" }} >
        <Dropdown.Item  onClick={() => changeLanguage("en")} active={translator.language === "en"} title="english">
         English
        </Dropdown.Item>
        <Dropdown.Item  onClick={() => changeLanguage("ja")} active={translator.language === "ja"} title="japanese">
         Japanese
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LanguageSwitcher;
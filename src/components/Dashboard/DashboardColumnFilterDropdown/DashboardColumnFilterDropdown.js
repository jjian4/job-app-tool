import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompressAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { Button, Dropdown, Checkbox } from "semantic-ui-react";

import DropdownButton from "../../DropdownButton/DropdownButton";
import "./DashboardColumnFilterDropdown.scss";

function DashboardColumnFilterDropdown(props) {
  const ref = useRef(null);
  const useOutsideClickListener = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.onClose();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideClickListener(ref);

  const dropdownButton = (
    <DropdownButton
      size="mini"
      basic
      icon="filter"
      text={props.hideLabel ? null : "Columns"}
      onClick={() => (props.open ? props.onClose() : props.onOpen())}
    />
  );

  const handleCheckboxChange = (e, { value }) => {
    const newSettings = Object.assign({}, props.columnFilter);
    const status = value;

    if (newSettings[status]?.isActive) {
      newSettings[status].isActive = false;
    } else if (newSettings[status]) {
      newSettings[status].isActive = true;
    } else {
      newSettings[status] = { isActive: true, isExpanded: false };
    }
    props.onChange(newSettings);
  };

  const handleSizeChange = (status, isExpanded) => {
    if (props.columnFilter?.isExpanded === isExpanded) {
      return;
    }
    const newSettings = Object.assign({}, props.columnFilter);

    if (newSettings[status]) {
      newSettings[status].isExpanded = isExpanded;
    } else {
      newSettings[status] = { isActive: false, isExpanded: isExpanded };
    }

    props.onChange(newSettings);
  };

  return (
    <span ref={ref}>
      <Dropdown
        className="DashboardColumnFilterDropdown"
        trigger={dropdownButton}
        icon={false}
        open={props.open}
        onClose={(e) => {
          if (props.open && e?.code === "Escape") {
            props.onClose();
          }
        }}
        direction={props.hideLabel ? "left" : "right"}
      >
        <Dropdown.Menu className="dropdownMenu">
          {Object.keys(props.entriesByStatus).map((status, index) => (
            <div className="dropdownRow" key={index}>
              <Checkbox
                toggle
                className="checkbox"
                label={`${status}${
                  props.entriesByStatus[status].length
                    ? ` (${props.entriesByStatus[status].length})`
                    : ""
                }`}
                value={status}
                checked={props.columnFilter[status]?.isActive}
                onChange={handleCheckboxChange}
              />

              <Button.Group className="sizeButtons" basic size="mini">
                <Button
                  title="Compress"
                  icon
                  active={!props.columnFilter[status]?.isExpanded}
                  onClick={() => handleSizeChange(status, false)}
                >
                  <FontAwesomeIcon icon={faCompressAlt} />
                </Button>
                <Button
                  title="Expand"
                  icon
                  active={props.columnFilter[status]?.isExpanded}
                  onClick={() => handleSizeChange(status, true)}
                >
                  <FontAwesomeIcon icon={faExpand} />
                </Button>
              </Button.Group>
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  );
}

export default DashboardColumnFilterDropdown;
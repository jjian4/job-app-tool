import { useState, useEffect } from "react";
import { Form, Button, Modal, Dropdown, TextArea, Input } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react';
import dateFormat from 'dateformat';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";


import CompanySelector from "../CompanySelector/CompanySelector";
import { CARD_COLORS, STATUS, notes } from '../../constants'
import "./EditEntryModal.scss";
import { IS_CARD_COLORS_ON } from "../../settings";


function EditEntryModal(props) {
    const [color, setColor] = useState(CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]);
    const [isStarred, setIsStarred] = useState(false)

    const [company, setCompany] = useState('')
    const [domain, setDomain] = useState('')
    const [logo, setLogo] = useState('')
    const [jobTitle, setJobTitle] = useState('')

    const [applyDate, setApplyDate] = useState(dateFormat(new Date(), "dd-mm-yyyy"))
    const [deadlineDate, setDeadlineDate] = useState('')
    const [status, setStatus] = useState(STATUS.APPLIED)

    const [url, setUrl] = useState('')

    const [notes, setNotes] = useState('')

    const statusOptions = Object.values(STATUS).map(status => (
        { text: status, value: status }
    ))

    useEffect(() => {
        // Initialize values everytime modal reopens
        if (props.open) {
            setColor(props.initialValues.color || color)
            setIsStarred(props.initialValues.isStarred || isStarred)
            setCompany(props.initialValues.company || company)
            setDomain(props.initialValues.domain || domain)
            setLogo(props.initialValues.logo || logo)
            setJobTitle(props.initialValues.jobTitle || jobTitle)
            setApplyDate(props.initialValues.applyDate || applyDate)
            setDeadlineDate(props.initialValues.deadlineDate || deadlineDate)
            setStatus(props.initialValues.status || status)
            setUrl(props.initialValues.url || url)
            setNotes(props.initialValues.notes || notes)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    const validateDate = (value) => {
        if (value.length !== 10) {
            return false;
        }

        // Switch date and month (dateformat only recognizes mm-dd-yyyy)
        const date = value.substring(0, 3);
        const month = value.substring(3, 6);
        const year = value.substring(6, 10);
        value = month + date + year;

        try {
            dateFormat(value, "dddd, mmmm dS, yyyy, h:MM:ss TT")
        } catch {
            return false;
        }

        return true;
    }

    return (
        <Modal
            className="EditEntryModal"
            onClose={props.onClose}
            open={props.open}
            size='small'
            closeOnEscape={false}
        >
            <Modal.Header className='header'>
                <div className='headerContent'>
                    <div>
                        {props.heading}
                    </div>

                    <div className='headerRight'>
                        {IS_CARD_COLORS_ON && (
                            <Dropdown
                                className='colorDropdown'
                                trigger={<div className='colorDropdownButton' style={{ backgroundColor: color }} />}
                                icon={false}
                                direction='left'
                            >
                                <Dropdown.Menu className='dropdownMenu'>
                                    <div className='colorsGrid'>
                                        {CARD_COLORS.map((colorOption, index) => (
                                            <div key={index} className='optionContainer'>
                                                <div
                                                    className={`colorOption ${colorOption === color ? 'colorOption-selected' : ''}`}
                                                    style={{ backgroundColor: colorOption }}
                                                    onClick={() => setColor(colorOption)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}

                        <FontAwesomeIcon
                            tabIndex={0}
                            className={isStarred ? 'starButton' : 'starOutlineButton'}
                            icon={isStarred ? faStar : faStarOutline}
                            onClick={() => setIsStarred(!isStarred)}
                        />
                    </div>
                </div>
            </Modal.Header>

            <Modal.Content>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Company</label>
                            <CompanySelector
                                companyObj={{ name: company, domain: domain, logo: logo }}
                                onNewValue={({ name, domain, logo }) => {
                                    setCompany(name);
                                    setDomain(domain);
                                    setLogo(logo);
                                }}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Job Title</label>
                            <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Application Date</label>
                            <DateInput
                                name="applyDate"
                                iconPosition="right"
                                closable
                                value={applyDate}
                                onChange={(e, { name, value }) => validateDate(value) && setApplyDate(value)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Next Interview / Deadline</label>
                            <DateInput
                                name="deadlineDate"
                                iconPosition="right"
                                closable
                                value={deadlineDate}
                                onChange={(e, { name, value }) => validateDate(value) && setDeadlineDate(value)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Status</label>
                            <Dropdown
                                fluid
                                search
                                selection
                                options={statusOptions}
                                value={status}
                                onChange={(e, { name, value }) => setStatus(value)}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>URL</label>
                            <Input value={url} onChange={e => setUrl(e.target.value)} />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Notes</label>
                            <TextArea
                                placeholder='Recruiter name, number of interviews, etc...'
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onClose}>
                    Cancel
                    </Button>
                <Button
                    content="Save"
                    onClick={() => props.onSave({
                        isStarred,
                        company: company.trim(),
                        domain: domain,
                        logo: logo,
                        jobTitle: jobTitle.trim(),
                        applyDate,
                        deadlineDate,
                        status,
                        url: url.trim(),
                        notes: notes.trim()
                    })}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
}

export default EditEntryModal;

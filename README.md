# SafeSphere

## Smart Community Disaster Response and Emergency Coordination Platform

**Protecting Communities Through Smart Emergency Response**

## Overview

SafeSphere is a community-focused emergency response platform designed to make reporting, coordination, preparedness, and response more efficient during emergencies and disasters.

The platform brings together citizens, volunteers, non-governmental organizations (NGOs), professionals, and administrators. It provides a structured way to report incidents, learn emergency procedures, discover support networks, monitor reports, and keep affected individuals informed.

Emergency reporting does not require an account. Guests can submit a quick report, view public safety information, learn first aid, and access the public education pages. An account adds profile access and authenticated emergency-report tracking.

## Key Features

### Emergency Response

- **Guest emergency reporting** for fires, floods, accidents, medical incidents, landslides, earthquakes, outbreaks, and other emergencies.
- **Authenticated reporting** with report tracking through the dashboard.
- **Evidence uploads** for emergency photographs where supported by the backend.
- **Location capture** using current coordinates or a manually entered address.
- **Emergency hotline display** from the existing safety API when published.

### Public Education

- **Emergency Education** at `/education` with guidance for CPR and cardiac emergencies, choking, bleeding, burns, fires, and natural disasters.
- **First Aid** at `/first-aid` with structured lessons covering scene safety, breathing checks, severe bleeding, burns, choking, shock, and fainting.
- **Safety Tips** at `/safety-tips` for common emergency situations.
- **How It Works** at `/how-it-works` explaining the reporting process step by step.
- **FAQ** at `/faq` with plain-language answers about reporting, accounts, locations, and tracking.

Educational content is general guidance. It does not replace local emergency dispatch, trained first-aid instruction, medical care, police, fire, ambulance, or other professional services.

### Community Network

- **Professionals directory** at `/professionals` with illustrative profiles for medical care, fire and rescue, first aid, search and rescue, mental health, and disaster preparedness.
- Category filtering for professional profiles.
- Profile images and descriptions are demo content and do not represent verified availability, identity, government endorsement, or live dispatch coverage.

### Accounts and Accessibility

- Login and registration at `/login` and `/register`.
- Protected profile page at `/profile`.
- Protected emergency dashboard at `/dashboard`.
- Responsive account and preferences dropdown in the navbar.
- Light and dark themes with a sun/moon control, persisted in browser storage.
- Larger-text accessibility setting, also persisted across visits.
- Active navigation indicators and accessible `aria-current` page states.

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page and available hotline display |
| `/report` | Public | Guest or authenticated emergency report form |
| `/education` | Public | Emergency education overview |
| `/first-aid` | Public | First-aid learning lessons |
| `/professionals` | Public | Illustrative professional network directory |
| `/safety-tips` | Public | Common emergency safety tips |
| `/how-it-works` | Public | Reporting process explanation |
| `/faq` | Public | Frequently asked questions |
| `/about` | Public | SafeSphere mission and contact information |
| `/login` | Public | User login |
| `/register` | Public | User registration |
| `/profile` | Authenticated | Current user profile |
| `/dashboard` | Authenticated | User emergency reports and search |

## User Roles

### Citizens

Citizens can report emergencies, provide descriptions or photographic evidence, learn safety procedures, and monitor the progress of their authenticated reports.

### Volunteers

Volunteers assist with emergency response by being assigned to incidents where their support is required.

### NGOs

NGOs can coordinate relief efforts and maintain records of supplies and other resources available for emergency response.

### Administrators

Administrators oversee the platform, manage emergency incidents and users, coordinate volunteers, and monitor overall emergency response activity.

## Technology Stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS v4, Axios, and Oxlint.
- **Backend:** Django 6, Django REST Framework, Simple JWT, Django Filters, CORS Headers, and Cloudinary storage support.
- **Database:** SQLite fallback for local development; `DATABASE_URL` can configure another database such as PostgreSQL.
- **Authentication:** JWT access and refresh tokens managed by the existing React authentication context.

## Project Structure

```text
frontend/
	src/
		components/   Shared navbar, footer, theme, and accessibility controls
		context/      Authentication and accessibility state
		pages/        Public, account, education, and dashboard pages
		routes/       Protected route handling
		services/     Axios API client
backend/
	accounts/       Registration, login, and profile API
	emergencies/    Emergency report API and models
	safety/         Safety content and hotline API
	config/         Django settings and URL configuration
```

## Local Development

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

Or from `frontend/`:

```bash
npm install
npm run dev
```

The frontend runs on `http://127.0.0.1:5173` by default.

Available frontend commands:

```bash
npm run lint
npm run build
npm run preview
```

### Backend

Activate the backend virtual environment, install dependencies, apply migrations, and start Django:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

On macOS/Linux, activate the environment with `.venv/bin/activate` instead.

Useful backend checks:

```bash
python manage.py check
python manage.py test
```

## Environment Configuration

The backend reads configuration through `python-decouple`. Set these values in `backend/.env` or in the deployment environment:

```env
SECRET_KEY=replace-with-a-secure-secret
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

For deployment, set `DEBUG=False` and provide the real hostnames in `ALLOWED_HOSTS`, separated by commas. The settings provide `localhost,127.0.0.1` as a local fallback when the value is missing or blank; they do not replace the need to configure production hosts.

Never commit production secrets or credentials to the repository.

## Safety and Data Limitations

- Life-threatening situations should be directed to local emergency services immediately.
- SafeSphere guidance does not replace emergency professionals or official authorities.
- The Professionals page currently uses illustrative demo data and remote portraits; it is not a live provider directory.
- Country-specific emergency numbers and organization information should come from verified backend data rather than being invented in the frontend.

## The Goal

SafeSphere is built around a simple idea: **make it easier for people to get help and easier for responders to provide it.**

By bringing emergency reporting, response coordination, communication, education, and resource management into one platform, SafeSphere aims to support faster and more organized disaster response within communities.

## Developer

**Nathan Kiprono**

## License

This project is licensed under the terms specified in the `LICENSE` file.


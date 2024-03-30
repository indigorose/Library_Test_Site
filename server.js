const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
	res.render('index', { records: null });
});

app.get('/search', async (req, res) => {
	const { lastName, firstName, birthYear, deathYear } = req.query;
	let query = supabase
		.from('grave_data_random')
		.select(`last_name, middle_name, first_name, title, birth_year_1`)
		.order('last_name', { ascending: true });
	if (lastName) {
		// do something
		query = query.ilike('last_name', `%${lastName}`);
	}
	if (firstName) {
		query = query.ilike('first_name', `%${firstName}`);
	}
	if (birthYear) {
		query = query.eq('birth_year', birthYear);
	}
	if (deathYear) {
		query = query.eq('death_year', deathYear);
	}

	// select * from grave_data_random where the last_name like ('%lastName%')
	//order by last_name asc
	try {
		let { data, error } = await query;
		if (error) {
			throw error;
		}
		console.log(data);
		res.render('index', { records: data });
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).send('Internal Server Error');
	}
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on Port: ${port}`));

<?php
declare(strict_types=1);

return [
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'u123456789_nrp_admin',
        'user' => 'u123456789_nrp_admin',
        'password' => 'REPLACE_WITH_DATABASE_PASSWORD',
    ],
    'github' => [
        'owner' => 'G-888',
        'repo' => 'NRP-Website',
        'branch' => 'main',
        'token' => 'github_pat_REPLACE_WITH_FINE_GRAINED_TOKEN',
    ],
    'security' => [
        'site_origin' => 'https://palevioletred-stinkbug-963169.hostingersite.com',
        'setup_key' => 'REPLACE_WITH_A_LONG_RANDOM_SETUP_KEY',
        'session_name' => 'nrp_admin_session',
    ],
];
